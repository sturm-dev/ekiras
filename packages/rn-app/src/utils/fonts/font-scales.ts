import {parseLargerText} from './parse-larger-text';

type fontScalesMap<T> = {[fontSize in fontSizeScales]: T};
export type fontSizeScales =
  | 'h0'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline';

// from scale -3 to +3 the size is the defaultInPx
// from scale +4 to +8 the size is parsed with widthPercentageToDP to readable and similar to scale +3
export const fontSizeByScale: fontScalesMap<number> = {
  h0       : parseLargerText({defaultInPx: 60, _4: 12  , _5: 9.67 , _6: 8    , _7: 6.66 , _8: 5.67 }),
  h1       : parseLargerText({defaultInPx: 34, _4: 6.8 , _5: 5.48 , _6: 4.53 , _7: 3.77 , _8: 3.21 }),
  h2       : parseLargerText({defaultInPx: 30, _4: 6   , _5: 4.84 , _6: 4    , _7: 3.33 , _8: 2.83 }),
  h3       : parseLargerText({defaultInPx: 24, _4: 4.8 , _5: 3.87 , _6: 3.2  , _7: 2.66 , _8: 2.26 }),
  h4       : parseLargerText({defaultInPx: 22, _4: 4.4 , _5: 3.54 , _6: 2.93 , _7: 2.44 , _8: 2.08 }),
  h5       : parseLargerText({defaultInPx: 20, _4: 4   , _5: 3.22 , _6: 2.66 , _7: 2.22 , _8: 1.89 }),
  h6       : parseLargerText({defaultInPx: 18, _4: 3.6 , _5: 2.9  , _6: 2.4  , _7: 2    , _8: 1.7  }),
  body1    : parseLargerText({defaultInPx: 16, _4: 3.2 , _5: 2.58 , _6: 2.13 , _7: 1.77 , _8: 1.51 }),
  body2    : parseLargerText({defaultInPx: 14, _4: 2.8 , _5: 2.26 , _6: 1.86 , _7: 1.55 , _8: 1.32 }),
  caption  : parseLargerText({defaultInPx: 12, _4: 2.4 , _5: 1.93 , _6: 1.6  , _7: 1.33 , _8: 1.13 }),
  overline : parseLargerText({defaultInPx: 10, _4: 2   , _5: 1.6  , _6: 1.33 , _7: 1.11 , _8: 0.94 }),
};

// indented with https://github.com/lmcarreiro/vscode-smart-column-indenter
// file ignored to prettier in .prettierignore
