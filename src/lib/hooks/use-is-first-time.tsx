import { useMMKVBoolean } from 'react-native-mmkv';

import { mmkvInstance } from '../storage';

const IS_FIRST_TIME = 'IS_FIRST_TIME';

export function useIsFirstTime() {
  const [isFirstTime, setIsFirstTime] = useMMKVBoolean(IS_FIRST_TIME, mmkvInstance);
  if (isFirstTime === undefined) {
    return [true, setIsFirstTime] as const;
  }
  return [isFirstTime, setIsFirstTime] as const;
}
