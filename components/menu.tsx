// import React from 'react';
// import {
//   SafeAreaView,
//   View,
//   StyleSheet,
//   Image,
//   Text,
//   Linking,
// } from 'react-native';

// import {
//   DrawerContentScrollView,
//   DrawerItemList,
//   DrawerItem,
//   DrawerContentComponentProps,
// } from '@react-navigation/drawer';

// type CustomSidebarMenuProps = DrawerContentComponentProps & {
//   // Add any additional props you need
// };

// const CustomSidebarMenu: React.FC<CustomSidebarMenuProps> = (props) => {
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       {/* <Image
//         source={require('../images/download.png')}
//         style={styles.sideMenuProfileIcon}
//       /> */}
//       <DrawerContentScrollView {...props}>
//         <DrawerItemList {...props} />
//         <DrawerItem
//           label="Visit Us"
//           onPress={() => Linking.openURL('https://google.com/')}
//         />
//         <View style={styles.customItem}>
//           <Text
//             onPress={() => {
//               Linking.openURL('https://google.com/');
//             }}>
//             Rate Us
//           </Text>
//           {/* <Image
//             source={require('../images/download.png')}
//             style={styles.iconStyle}
//           /> */}
//         </View>
//       </DrawerContentScrollView>
//       <Text
//         style={{
//           fontSize: 16,
//           textAlign: 'center',
//           color: 'grey',
//         }}>
//         www.google.com
//       </Text>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   sideMenuProfileIcon: {
//     resizeMode: 'center',
//     width: 150,
//     height: 150,
//     borderRadius: 200 / 2,
//     alignSelf: 'center',
//   },
//   iconStyle: {
//     width: 15,
//     height: 15,
//     marginHorizontal: 5,
//   },
//   customItem: {
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
// });

// export default CustomSidebarMenu;
