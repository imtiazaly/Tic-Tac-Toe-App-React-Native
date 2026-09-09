import { StyleSheet, Text, View } from 'react-native';
import { PropsWithChildren } from 'react';
import FontAwesome from '@react-native-vector-icons/fontawesome';

type IconProps = PropsWithChildren<{
  name: string;
}>;

export default function icons({ name }: IconProps) {
  switch (name) {
    case 'circle':
      return <FontAwesome name="circle-thin" size={38} color="#F7CD2E" />;
      break;

    case 'cross':
      return <FontAwesome name="times" size={38} color="#38CC77" />;
      break;

    default:
      return <FontAwesome name="heart" size={24} color="red" />;
  }
}

const styles = StyleSheet.create({});
