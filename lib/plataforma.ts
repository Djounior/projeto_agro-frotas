import { Platform, useWindowDimensions } from 'react-native';

export const ehWeb = Platform.OS === 'web';

export function useLayout() {
  const { width } = useWindowDimensions();
  return {
    largo: width >= 900,
    colunas: width >= 1200 ? 3 : width >= 700 ? 2 : 1,
  };
}