import { extendTheme } from '@chakra-ui/react';
/**
 *
 */
export const theme = extendTheme({
  textStyles: {
    'form-label': {
      fontSize: '13px',
      fontWeight: '400',
      color: '#666666',
      lineHeight: '24px'
    }
  },
  colors: {
    brand: {
      primary: '#0058FA',
      grey: '#666666'
    },
    primary: {
      500: '#0058FA',
      600: '#2B6CB0'
    },
    border: {
      100: '#ABB4D0'
    }
  },
  sizes: {
    max: '100%'
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: '2px',
        fontWeight: '500',
        fontSize: '14px',
        lineHeight: '20px'
      },
      sizes: {
        md: { h: '32px' }
      },
      variants: {
        'maker-modal': {
          height: '2em',
          lineHeight: '2em',
          background: '#0058FA',
          borderRadius: '2px',
          color: 'white',
          padding: '1.125em'
        }
      }
    },
    FormLabel: {
      baseStyle: {
        display: 'flex',
        margin: '0 0 7px 0',
        justifyContent: 'space-between'
      }
    },
    Popover: {
      variants: {
        responsive: {
          popper: {
            maxWidth: 'unset',
            width: 'unset'
          }
        }
      }
    },
    Table: {
      variants: {
        simple: {
          // table: {
          //   color: '#666666'
          // },
          // thead: {
          //   bgColor: '#F4F4F4',
          //   boxShadow:
          //     '0px 2px 4px 0px rgba(0, 0, 0, 0.05), 0px 1px 0px 0px rgba(0, 0, 0, 0.09), 0px -1px 0px 0px rgba(0, 0, 0, 0.05)'
          // },
          th: {
            textTransform: 'none'
          }
        },
        pk: {
          table: {
            color: '#999999'
          },
          thead: {
            color: '#FFFFFF'
          },
          th: {
            textTransform: 'capitalize',
            textAlign: 'center',
            fontSize: '16px',
            lineHeight: '16px',
            fontWeight: '600',
            py: '7px',
            border: '1px solid #FFFFFF',
            bgColor: '#ABB4D0'
          },
          tbody: {
            color: '#999999'
          },
          tr: {
            fontSize: '12px',
            lineHeight: '1',
            _even: {
              bgColor: '#F7F9FF'
            },
            _odd: {
              bgColor: '#EFF2F8'
            }
          },
          td: {
            border: '1px solid rgba(171, 180, 208, 0.22)',
            px: 0,
            textAlign: 'center',
            borderTop: '0',
            borderBottom: '0',
            h: '60px',
            verticalAlign: 'middle'
          }
        },
        maker: {
          th: {
            textTransform: 'capitalize',
            fontSize: '14px',
            fontWeight: '600',
            lineHeight: '20px',
            bgColor: '#ABB4D0',
            color: '#000'
          },
          tr: {
            fontSize: '14px',
            lineHeight: '20px',
            h: '50px',
            _even: {
              bgColor: '#EFF2F8'
            },
            _odd: {
              bgColor: '#F7F9FF'
            }
          }
        }
      },
      sizes: {
        small: {
          table: {
            fontSize: '12px'
          },
          th: {
            fontSize: '12px',
            fontWeight: '400',
            padding: '9px 8px'
          },
          td: {
            padding: '22px 8px'
          }
        },
        md: {
          table: {
            fontSize: '14px'
          }
          // th: {
          //   fontSize: '12px',
          //   fontWeight: '400',
          //   padding: '9px 8px'
          // },
          // td: {
          //   padding: '22px 8px'
          // }
        }
      }
    },
    Modal: {
      variants: {
        common: {
          header: {
            textAlign: 'center'
          },
          closeButton: {
            top: '0.75rem'
          }
        },
        maker: {
          content: {
            background: '#F8F8F8',
            borderRadius: '4px'
          },
          header: {
            height: '50px',
            textAlign: 'center',
            fontSize: '1rem',
            boxShadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.05)',
            borderRadius: '4px 4px 0px 0px',
            background: '#FFFFFF',
            color: '#0058FA'
          },
          closeButton: {
            top: '0.75rem'
          },
          body: {
            padding: ' 41px 49px 40px 49px',
            background: '#F8F8F8'
          },
          footer: {
            padding: '11px 0px',
            boxSizing: 'border-box',
            height: '60px',
            justifyContent: 'center',
            color: '#0058FA',
            background: '#FFFFFF',
            boxShadow: '0px 2px 5px 0px rgba(0, 0, 0, 0.1)'
          }
        }
      }
    }
  },
  fonts: {
    heading: 'system-ui, sans-serif',
    body: 'system-ui, sans-serif'
  },
  styles: {
    global: {
      'html, body, #root': {
        height: '100%'
      },
      /**
       * normalize.css
       */
      html: {
        lineHeight: 1.5,
        WebkitTextSizeAdjust: '100%',
        fontFamily: 'system-ui, sans-serif'
      },
      body: {
        position: 'relative',
        minHeight: '100%',
        fontFeatureSettings: "'kern'"
      },
      '*,*::before,*::after': {
        borderWidth: '0',
        borderStyle: 'solid',
        boxSizing: 'border-box'
      },
      main: { display: 'block' },
      hr: {
        borderTopWidth: '1px',
        boxSizing: 'content-box',
        height: '0',
        overflow: 'visible'
      },
      'pre,code,kbd,samp': {
        fontFamily: 'SFMono-Regular,  Menlo, Monaco, Consolas, monospace',
        fontSize: '1em'
      },
      a: {
        backgroundColor: 'transparent',
        color: 'inherit',
        textDecoration: 'inherit'
      },
      'abbr[title]': {
        borderBottom: 'none',
        textDecoration: ['underline', 'underline dotted'],
        WebkitTextDecoration: 'underline dotted'
      },
      'b,strong': { fontWeight: 'bold' },
      small: { fontSize: '80%' },
      'sub,sup': {
        fontSize: '75%',
        lineHeight: 0,
        position: 'relative',
        verticalAlign: 'baseline'
      },
      sub: { bottom: '-0.25em' },
      sup: { top: '-0.5em' },
      img: { borderStyle: 'none' },
      'button,input,optgroup,select,textarea': {
        fontFamily: 'inherit',
        fontSize: '100%',
        lineHeight: 'inherit',
        margin: '0',
        padding: '0',
        color: 'inherit'
      },
      'button,input': { overflow: 'visible' },
      'button,select': { textTransform: 'none' },
      'button::-moz-focus-inner,[type="button"]::-moz-focus-inner,[type="reset"]::-moz-focus-inner,[type="submit"]::-moz-focus-inner': {
        borderStyle: 'none',
        padding: '0'
      },
      fieldset: { padding: '0', margin: '0' },
      legend: {
        boxSizing: 'border-box',
        color: 'inherit',
        display: 'table',
        maxWidth: '100%',
        padding: '0',
        whiteSpace: 'normal'
      },
      progress: { verticalAlign: 'baseline' },
      textarea: { overflow: 'auto', resize: 'vertical' },
      '[type="checkbox"],[type="radio"]': {
        boxSizing: 'border-box',
        padding: '0'
      },
      '[type="number"]::-webkit-inner-spin-button,[type="number"]::-webkit-outer-spin-button': {
        WebkitAppearance: 'none !important'
      },
      'input[type="number"]': { MozAppearance: 'textfield' },
      '[type="search"]': { WebkitAppearance: 'textfield', outlineOffset: '-2px' },
      '[type="search"]::-webkit-search-decoration': {
        WebkitAppearance: 'none !important'
      },
      '::-webkit-file-upload-button': {
        WebkitAppearance: 'button',
        font: 'inherit'
      },
      details: { display: 'block' },
      summary: { display: 'list-item' },
      template: { display: 'none' },
      '[hidden]': { display: 'none !important' },
      'body,blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre': {
        margin: '0'
      },
      button: { background: 'transparent', padding: '0' },
      'ol,ul': { margin: '0', padding: '0' },
      'button,[role="button"]': { cursor: 'pointer' },
      'button::-moz-focus-inner': { border: '0 !important' },
      table: { borderCollapse: 'collapse' },
      'h1,h2,h3,h4,h5,h6': {
        fontSize: 'inherit',
        fontWeight: 'inherit'
      },
      'img,svg,video,canvas,audio,iframe,embed,object': {
        display: 'block'
      },
      'img,video': { maxWidth: '100%', height: 'auto' },
      '[data-js-focus-visible] :focus:not([data-focus-visible-added])': {
        outline: 'none',
        boxShadow: 'none'
      },
      'select::-ms-expand': { display: 'none' }
    }
  }
});
