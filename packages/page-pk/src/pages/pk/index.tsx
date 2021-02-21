import { AddIcon } from '@chakra-ui/icons';
import { useAccount, useContractTx, useModal } from '@patract/react-hooks';
import {
  Address,
  Amount,
  Box,
  Button,
  Center,
  CircularProgress,
  Flex,
  PageHeader,
  PageLayout,
  PageMain,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@patract/ui-components';
import Pagination from '@material-ui/lab/Pagination';
import { truncated } from '@patract/utils';
import React, { ComponentProps, useCallback, useMemo, useReducer, useState } from 'react';
import { FaChessBoard } from 'react-icons/fa';
import { usePkContract } from '../../hooks/usePkContract';
import { usePklist } from '../../hooks/usePklist';
import { PaperImage, RockImage, ScissorsImage } from '../../images/';
import CreateGame from './create-game';
import { DeleteButton } from './delete';
import { RevealButton } from './reveal';
import { JoinButton } from './join';

export type GameChoice = 'Scissors' | 'Rock' | 'Paper' | null | undefined;
export type GameStatus = 'wait_for_join' | 'wait_for_reveal' | 'closed' | 'punished' | 'expired' | 'waiting';
export function getSaltKey(hash: string, account: string): string {
  return `${hash}salt: ${account}`;
}
export function getChoiceKey(hash: string, account: string): string {
  return `${hash}choice: ${account}`;
}
const FirstRowTd: React.FC<ComponentProps<typeof Td>> = ({ children, ...rest }) => (
  <Td
    sx={{
      fontWeight: '600',
      py: '9px',
      color: '#000000',
      bgColor: '#F6F6F6'
    }}
    {...rest}
  >
    {children}
  </Td>
);

const getTagColor = (winner: 'Creator' | 'joiner' | 'even', role: 'Creator' | 'joiner') => {
  if (winner === 'even') return { color: '#000000', bgColor: '#ABB4D0' };
  return winner === role ? { color: '#FFFFFF', bgColor: '#25A17C' } : { color: '#FFFFFF', bgColor: '#FA6400' };
};

const renderTag = (winner: 'Creator' | 'joiner' | 'even' | null, role: 'Creator' | 'joiner') => {
  if (!winner) return null;
  const tagText = winner === 'even' ? 'Even' : winner === role ? 'Win' : 'Lose';
  const color = getTagColor(winner, role);
  const styles = role === 'Creator' ? { left: 0 } : { right: 0 };
  const triangleStyles =
    role === 'Creator'
      ? {
          left: 0,
          borderWidth: '36px 36px 0 0',
          borderColor: `${color['bgColor']} transparent transparent transparent`
        }
      : {
          right: 0,
          borderWidth: '0 36px 36px 0',
          borderColor: `transparent ${color['bgColor']} transparent transparent`
        };
  const textStyles =
    role === 'Creator'
      ? {
          transform: 'rotate(-45deg)',
          mt: '2px',
          ml: '-10px'
        }
      : {
          transform: 'rotate(45deg)',
          mt: '4px',
          mr: '-11px'
        };
  return (
    <Box
      sx={{
        w: '36px',
        h: '36px',
        position: 'absolute',
        top: 0,
        ...styles,
        _before: {
          content: '""',
          position: 'absolute',
          top: 0,
          width: 0,
          height: 0,
          borderStyle: 'solid',
          ...triangleStyles
        }
      }}
    >
      <Text
        sx={{
          display: 'block',
          position: 'relative',
          color: `${getTagColor(winner, role)['color']}`,
          fontWeight: '600',
          zIndex: 'docked',
          ...textStyles
        }}
      >
        {tagText}
      </Text>
    </Box>
  );
};

const renderChoice = (choice: GameChoice, revert = false) => {
  const imageStyle: any = {
    display: 'inline-block',
    w: '6',
    h: '6',
    color: 'orange.800'
  };
  if (revert) {
    imageStyle.transform = 'scaleX(-1)';
  }
  if (choice === 'Rock') return <RockImage sx={imageStyle} />;
  if (choice === 'Paper') return <PaperImage sx={imageStyle} />;
  if (choice === 'Scissors') return <ScissorsImage sx={imageStyle} />;

  return (
    <Flex sx={{ alignItems: 'center', mx: '10px' }} justifyContent='center'>
      <FaChessBoard viewBox='0 0 320 320' style={{ width: '24px', height: '24px', color: 'black' }} />
    </Flex>
  );
};

const PK: React.FC = () => {
  const { isOpen: isCreateGameOpen, onOpen: onCreateGameOpen, onClose: onCreateGameClose } = useModal();
  const { isOpen: isJoinGameOpen, onOpen: onJoinGameOpen, onClose: onJoinGameClose } = useModal();
  const [signal, forceUpdate] = useReducer((x) => x + 1, 0);
  const { currentAccount } = useAccount();
  const { contract } = usePkContract();
  const { excute: deleteGame } = useContractTx({ title: 'Delete Game', contract, method: 'delete' });
  const { excute: revealGame } = useContractTx({ title: 'Reveal Game', contract, method: 'reveal' });
  const { excute: expireGame } = useContractTx({ title: 'Delete Game', contract, method: 'delete' });
  const { excute } = useContractTx({ title: 'Delete Game', contract, method: 'delete' });
  const { data, isLoading } = usePklist(signal);

  const handleDeleteGame = useCallback(
    (id) => {
      return deleteGame(id).then(() => {
        forceUpdate();
      });
    },
    [forceUpdate, deleteGame]
  );

  const getResult = useCallback((item, role) => {
    if (!item.result) return null;

    if (item.result === 'Draw') {
      return renderTag('even', role);
    }
    if (item.result === 'CreatorWin') {
      return renderTag('Creator', role);
    }
    if (item.result === 'JoinerWin') {
      return renderTag('joiner', role);
    }

    return null;
  }, []);

  const renderOperations = useCallback(
    (item: any) => {
      if (item.status === 'End') {
        return <Text color='#ABB4D0'>Ended</Text>;
      }
      if (item.status === 'Expire') {
        return <Text color='gray.500'>Expired</Text>;
      }
      if (item.status === 'Delete') {
        return <Text color='#ABB4D0'>Deleted</Text>;
      }
      if (item.status === 'Join') {
        if (currentAccount === item.creator) {
          return (
            <Flex direction='column'>
              <DeleteButton onSubmit={handleDeleteGame} item={item} />
            </Flex>
          );
        } else {
          return (
            <Flex direction='column'>
              <JoinButton onSubmit={forceUpdate} item={item} />
            </Flex>
          );
        }
      }
      if (item.status === 'Settle') {
        if (currentAccount === item.creator) {
          return (
            <Flex direction='column'>
              <RevealButton onSubmit={forceUpdate} item={item} />
            </Flex>
          );
        } else {
          return <Text color='gray.700'>{'Waitting'}</Text>;
        }
      }

      return null;
    },
    [currentAccount, forceUpdate, handleDeleteGame]
  );

  const renderGameRow = useCallback(
    (item: any) => {
      const isRevealed = item.salt;

      return (
        <Tr key={item.id}>
          <Td>{item.id}</Td>
          <Td
            sx={{
              color: isRevealed ? '#000000' : 'auto',
              fontWeight: isRevealed ? 'semibold' : 'auto'
            }}
          >
            {!isRevealed ? <Text>{'-'}</Text> : (item.salt || '')}
          </Td>
          <Td sx={{ px: '3', textAlign: 'left' }}>
            <Address value={item.creator} />
          </Td>
          <Td sx={{ position: 'relative' }}>
            {getResult(item, 'Creator')}
            {renderChoice(item.create_choice)}
          </Td>
          <Td>
            <Amount value={item.value} decimals={10} postfix='DOT' />
          </Td>
          <Td sx={{ position: 'relative' }}>
            {getResult(item, 'joiner')}
            {item.joiner_choice === 'None' ? <Center>-</Center> : renderChoice(item.joiner_choice, true)}
          </Td>
          <Td sx={{ px: '3', textAlign: 'left' }}>
            {item.joiner && item.joiner !== '5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM' ? (
              <Address value={item.joiner} />
            ) : (
              <Center>-</Center>
            )}
          </Td>
          <Td>{renderOperations(item)}</Td>
        </Tr>
      );
    },
    [renderOperations]
  );

  const pageSize = 10;

  const count = useMemo(() => {
    return data ? Math.ceil(data.length / pageSize) : 0;
  }, [data]);

  const [page, setPage] = useState(1);

  return (
    <>
      <Flex flexDirection='row-reverse'>
        <Button mb={4} onClick={onCreateGameOpen}>
          <AddIcon sx={{ mr: '10px' }} />
          Create Game
        </Button>
      </Flex>
      <Table variant='pk' sx={{ borderBottom: '1px solid rgba(171, 180, 208, 0.22)' }}>
        <Thead>
          <Tr>
            <Th px='13px'>ID</Th>
            <Th colSpan={3}>Creator</Th>
            <Th>Value</Th>
            <Th colSpan={2}>Joiner</Th>
            <Th px='0'>Operation</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <FirstRowTd></FirstRowTd>
            <FirstRowTd>Salt</FirstRowTd>
            <FirstRowTd w='200px'>Account</FirstRowTd>
            <FirstRowTd w='77px'>Choice</FirstRowTd>
            <FirstRowTd>DOT</FirstRowTd>
            <FirstRowTd w='77px'>Choice</FirstRowTd>
            <FirstRowTd w='200px'>Account</FirstRowTd>
            <FirstRowTd></FirstRowTd>
          </Tr>
          {data.slice(pageSize * (page - 1), pageSize * page).map((game) => renderGameRow(game))}
        </Tbody>
      </Table>
      {((data && data.length !== 0) || page !== 1) && (
        <Flex mt='4' justifyContent='flex-end'>
          <Pagination count={count} page={page} onChange={(_, page) => setPage(page)} shape='rounded' />
        </Flex>
      )}
      {!data.length && isLoading && (
        <Center p={16}>
          <CircularProgress isIndeterminate color='blue.300' />
        </Center>
      )}
      <CreateGame isOpen={isCreateGameOpen} onClose={onCreateGameClose} onSubmit={forceUpdate} />
    </>
  );
};

export default () => (
  <PageLayout>
    <PageHeader title='Patra PK' />
    <PageMain>
      <PK />
    </PageMain>
  </PageLayout>
);
