import React, { ComponentProps } from 'react';
import { Flex, Button, Box, Table, Thead, Tbody, Tr, Th, Td, Text, Icon, useDisclosure } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { PageLayout, PageHeader, PageMain, ApiReady } from '@patract/ui-components';
import tableData from './data';
import { FaRegHandRock, FaRegHandPaper, FaRegHandPeace, FaChessBoard } from 'react-icons/fa';
import { BsFillEyeFill } from 'react-icons/bs';
import CreateGame from './create-game';
import JoinGame from './join-game';

export type GameChoice = 'scissors' | 'rock' | 'paper' | null | undefined;
export type GameStatus = 'wait_for_join' | 'wait_for_reveal' | 'closed' | 'punished' | 'expired' | 'waiting';
export type GameInfo = {
  id: string;
  creater: {
    hash: string;
    salt: string | null;
    revealed: boolean;
    account: string;
    choice: GameChoice;
    value: number | null;
  };
  joiner: {
    account: string;
    choice: GameChoice;
    value: number | null;
  } | null;
  winner: 'creater' | 'joiner' | 'even' | null;
  status: GameStatus;
  expireTime?: number;
};

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

const TdButton: React.FC<ComponentProps<typeof Button>> = ({ children, ...rest }) => (
  <Button variant='link' sx={{ fontSize: '12px', fontWeight: '300' }} {...rest}>
    {children}
  </Button>
);

const getTagColor = (winner: 'creater' | 'joiner' | 'even', role: 'creater' | 'joiner') => {
  if (winner === 'even') return { color: '#000000', bgColor: '#ABB4D0' };
  return winner === role ? { color: '#FFFFFF', bgColor: '#25A17C' } : { color: '#FFFFFF', bgColor: '#FA6400' };
};

const renderTag = (winner: 'creater' | 'joiner' | 'even' | null, role: 'creater' | 'joiner') => {
  if (!winner) return null;
  const tagText = winner === 'even' ? 'Even' : winner === role ? 'Win' : 'Lose';
  const color = getTagColor(winner, role);
  const styles = role === 'creater' ? { left: 0 } : { right: 0 };
  const triangleStyles =
    role === 'creater'
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
    role === 'creater'
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

const renderChoice = (choice: GameChoice, role: 'creater' | 'joiner') => {
  const iconStyle = {
    w: '6',
    h: '6',
    color: 'orange.800',
    ...(role === 'creater'
      ? {
          transform: 'rotate(90deg)'
        }
      : {
          transform: 'scaleY(-1) rotate(-90deg)'
        })
  };
  if (choice === 'rock') return <Icon as={FaRegHandRock} sx={iconStyle} />;
  if (choice === 'paper') return <Icon as={FaRegHandPaper} sx={iconStyle} />;
  if (choice === 'scissors') return <Icon as={FaRegHandPeace} sx={iconStyle} />;
  if (!choice && role === 'creater') {
    return (
      <Flex sx={{ alignItems: 'center', mx: '10px' }}>
        <Icon as={BsFillEyeFill} sx={{ w: '4', h: '4', color: 'black', mr: '16px' }} />
        <FaChessBoard viewBox='0 0 320 320' style={{ width: '24px', height: '24px', color: 'black' }} />
      </Flex>
    );
  }
  return null;
};

const renderOperations = (operations: any, status: GameStatus, expireTime?: number) => {
  if (status === 'wait_for_join') {
    return (
      <Flex direction='column'>
        <TdButton colorScheme='blue' onClick={operations.onJoinGameOpen}>
          Join
        </TdButton>
        <TdButton colorScheme='blue'>Invite robot</TdButton>
        <TdButton colorScheme='red'>Delete</TdButton>
      </Flex>
    );
  }
  if (status === 'wait_for_reveal') return <TdButton colorScheme='green'>Reveal</TdButton>;
  if (status === 'closed') return <Text>Closed</Text>;
  if (status === 'expired')
    return (
      <Flex direction='column'>
        <TdButton colorScheme='red'>Punish</TdButton> Expired
      </Flex>
    );
  if (status === 'punished') return <Text>Punished</Text>;
  if (status === 'waiting') return <Text>Waiting</Text>;
  return null;
};

const renderGameRow = (gameInfo: GameInfo, operations: any) => {
  const { id, creater, joiner, status, winner, expireTime } = gameInfo;
  const { value: joinerValue, account: joinerAccount, choice: joinerChoice } = joiner || {};
  return (
    <Tr key={id}>
      <Td>{id}</Td>
      <Td sx={{ color: '#000000', fontWeight: '600' }}>{creater.hash}</Td>
      <Td sx={{ color: creater.revealed ? '#000000' : 'auto', fontWeight: creater.revealed ? '600' : 'auto' }}>
        {creater.salt ? creater.salt : '~'}
        <Text>{!creater.revealed && '(Unrevealed)'}</Text>
      </Td>
      <Td>{creater.account}</Td>
      <Td sx={{ position: 'relative' }}>
        {renderTag(winner, 'creater')}
        {renderChoice(creater.choice, 'creater')}
      </Td>
      <Td>
        <Text as='span' sx={{ fontSize: '16px', fontWeight: '500', color: 'brand.primary' }}>
          {creater.value}
        </Text>
        {joinerValue && (
          <Text as='span' sx={{ display: 'inline-block', mx: '3px', fontWeight: '500' }}>
            VS
          </Text>
        )}
        <Text as='span' sx={{ fontSize: '16px', fontWeight: '500', color: 'brand.primary' }}>
          {joinerValue}
        </Text>
      </Td>
      <Td sx={{ position: 'relative' }}>
        {renderTag(winner, 'joiner')}
        {renderChoice(joinerChoice, 'joiner')}
      </Td>
      <Td>{joinerAccount}</Td>
      <Td>{renderOperations(operations, status, expireTime)}</Td>
    </Tr>
  );
};

const PK: React.FC = () => {
  const { isOpen: isCreateGameOpen, onOpen: onCreateGameOpen, onClose: onCreateGameClose } = useDisclosure();
  const { isOpen: isJoinGameOpen, onOpen: onJoinGameOpen, onClose: onJoinGameClose } = useDisclosure();

  const operations = {
    onJoinGameOpen
  };

  return (
    <PageLayout>
      <PageHeader title='Patra PK' />
      <PageMain>
        <ApiReady>
          <Flex flexDirection='row-reverse'>
            <Button
              sx={{
                textAlign: 'right',
                fontSize: '14px',
                fontWeight: '500',
                lineHeight: '20px',
                color: 'brand.primary',
                my: '14px'
              }}
              onClick={onCreateGameOpen}
            >
              <AddIcon sx={{ mr: '10px' }} />
              Create Game
            </Button>
          </Flex>
          <Box
            sx={{
              border: '1px solid #E0E0E0',
              borderRadius: '8px',
              bgColor: '#FFFFFF',
              py: '19px',
              px: '16px'
            }}
          >
            <Table variant='pk'>
              <Thead>
                <Tr>
                  <Th px='13px'>ID</Th>
                  <Th colSpan={4}>Creater</Th>
                  <Th>Value</Th>
                  <Th colSpan={2}>Joiner</Th>
                  <Th px='0'>Operation</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <FirstRowTd></FirstRowTd>
                  <FirstRowTd>Hash</FirstRowTd>
                  <FirstRowTd>Salt</FirstRowTd>
                  <FirstRowTd>Account</FirstRowTd>
                  <FirstRowTd w='77px'>Choice</FirstRowTd>
                  <FirstRowTd>Dot</FirstRowTd>
                  <FirstRowTd w='77px'>Choice</FirstRowTd>
                  <FirstRowTd>Account</FirstRowTd>
                  <FirstRowTd></FirstRowTd>
                </Tr>
                {tableData.map((game) => renderGameRow(game, operations))}
              </Tbody>
            </Table>
          </Box>
          <CreateGame isOpen={isCreateGameOpen} onClose={onCreateGameClose} />
          <JoinGame isOpen={isJoinGameOpen} onClose={onJoinGameClose} />
        </ApiReady>
      </PageMain>
    </PageLayout>
  );
};

export default PK;
