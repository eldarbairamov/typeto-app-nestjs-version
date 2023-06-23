import { SubmitHandler, useForm } from "react-hook-form";
import { IRegistrationForm } from "../../../interface";
import { joiResolver } from "@hookform/resolvers/joi";
import { registrationValidator } from "../../../validator";
import { useAppDispatch, useAppSelector } from "../../../hook";
import { authAsyncActions } from "../../../store/slice";
import { UnauthorizedRouter, UnauthorizedRoutesEnum } from "../../../router";
import { Button, VStack } from "@chakra-ui/react";
import { AppFormControl, AppFormControlPass } from "../../UI";
import { useColorValues } from "../../../constant";

export function RegistrationForm() {
   const { isLoading } = useAppSelector( state => state.authReducer );

   const { register, handleSubmit, formState: { errors, isValid } } = useForm<IRegistrationForm>( {
      resolver: joiResolver( registrationValidator ),
      mode: "onTouched",
   } );

   const dispatch = useAppDispatch();

   const onSubmit: SubmitHandler<IRegistrationForm> = async ( data: IRegistrationForm ) => {
      const result = await dispatch( authAsyncActions.registration( { data } ) );
      if ( authAsyncActions.registration.fulfilled.match( result ) ) {
         UnauthorizedRouter.navigate( UnauthorizedRoutesEnum.LoginPage );
      }
   };

   const { BUTTON_COLOR, BUTTON_HOVER_COLOR, BG_SECOND } = useColorValues();

   return (
       <form onSubmit={ handleSubmit( onSubmit ) }
             noValidate={ true }>

          <VStack p={ "50px" }
                  alignItems={ "stretch" }
                  bg={ BG_SECOND }
                  rounded={ 20 }
                  boxShadow={ "xl" }
                  spacing={ 5 }>

             <VStack spacing={ 3 }
                     w={ 300 }>

                <AppFormControl errorMessage={ errors.username?.message }
                                labelName={ "Імʼя користувача" }
                                fieldName={ "username" }
                                isRequired={ true }
                                register={ register }/>

                <AppFormControl errorMessage={ errors.email?.message }
                                labelName={ "Електронна пошта" }
                                fieldName={ "email" }
                                isRequired={ true }
                                register={ register }/>

                <AppFormControlPass errorMessage={ errors.password?.message }
                                    register={ register }
                                    isRequired={ true }
                                    labelName={ "Пароль" }
                                    fieldName={ "password" }/>

             </VStack>

             <VStack alignItems={ "stretch" }
                     spacing={ 6 }>

                <Button bg={ BUTTON_COLOR }
                        type={ "submit" }
                        isLoading={ isLoading }
                        isDisabled={ !isValid }
                        color={ "white" }
                        size={ "lg" }
                        _hover={ { bg: BUTTON_HOVER_COLOR } }>
                   Зареєструватись
                </Button>

                <Button variant={ "unstyled" }
                        color={ BUTTON_COLOR }
                        onClick={ () => UnauthorizedRouter.navigate( UnauthorizedRoutesEnum.LoginPage ) }>
                   Увійти
                </Button>

             </VStack>

          </VStack>

       </form>
   );
}