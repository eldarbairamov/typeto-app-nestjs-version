import { useEffect } from "react";

import { useAppDispatch, useAppSelector, useInputHandler } from "../../hook";
import { findUserService } from "../../service";
import { userActions } from "../../store/slice";
import { IUserBySearch } from "../../interface";
import { Box, Button, Center, Divider, Input, InputGroup, InputLeftElement, InputRightElement, VStack } from "@chakra-ui/react";
import { Icon, Search2Icon } from "@chakra-ui/icons";
import { UserItem } from "../../component";
import { RiUserSearchLine } from "react-icons/all";
import { useColorValues } from "../../constant";

export function FindUser( { onModalClose }: { onModalClose: () => void } ) {
   const { userBySearch } = useAppSelector(state => state.userReducer);

   const dispatch = useAppDispatch();

   const { value, handleChange } = useInputHandler();

   const { findUser } = findUserService(value);

   useEffect(() => {
      dispatch(userActions.setUser({} as IUserBySearch));
   }, []);

   const { BUTTON_COLOR, BUTTON_HOVER_COLOR, PLACEHOLDER_COLOR, FONT_COLOR, ICON_COLOR, WHITE_COLOR } = useColorValues();

   return (
       <VStack h={ 200 }>

          <Box p={ 2 }>

             <InputGroup w={ 350 }>

                <InputLeftElement pointerEvents={ "none" }
                                  children={ <Search2Icon color={ ICON_COLOR }/> }/>

                <Input border={ "none" }
                       autoFocus={ true }
                       value={ value }
                       color={ FONT_COLOR }
                       onChange={ handleChange }
                       _placeholder={ { color: PLACEHOLDER_COLOR } }
                       placeholder={ "введіть e-mail користувача" }/>

                <InputRightElement w={ 130 }
                                   justifyContent={ "flex-end" }>

                   <Button onClick={ findUser }
                           bg={ BUTTON_COLOR }
                           color={ WHITE_COLOR }
                           _hover={ { bg: BUTTON_HOVER_COLOR } }>
                      Знайти
                   </Button>

                </InputRightElement>

             </InputGroup>

          </Box>

          <Divider/>

          { Object.keys(userBySearch).length
              ?
              <Center w={ "100%" }
                      h={ "100%" }>

                 <UserItem onModalClose={ onModalClose }
                           user={ userBySearch }/>

              </Center>
              :
              <Center w={ "100%" }
                      h={ "100%" }>

                 <Icon as={ RiUserSearchLine }
                       boxSize={ "70px" }
                       color={ ICON_COLOR }/>

              </Center>
          }

       </VStack>
   );
}