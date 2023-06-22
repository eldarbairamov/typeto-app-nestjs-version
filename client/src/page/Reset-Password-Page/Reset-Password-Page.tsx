import { SubmitHandler, useForm } from "react-hook-form";
import { IResetPasswordForm } from "../../interface";
import { joiResolver } from "@hookform/resolvers/joi";
import { resetPasswordValidator } from "../../validator";
import { useSearchParams } from "react-router-dom";
import { Button, Center, VStack } from "@chakra-ui/react";
import { AppFormControlPass, Logo } from "../../component";
import { useAppDispatch, useAppSelector } from "../../hook";
import { appActions, authAsyncActions } from "../../store/slice";
import { UnauthorizedRouter, UnauthorizedRoutesEnum } from "../../router";
import { useColorValues } from "../../constant";

export function ResetPasswordPage() {
   const { isLoading } = useAppSelector( state => state.authReducer );

   const [ searchParams ] = useSearchParams();

   const resetPasswordToken = searchParams.get( "token" );

   const dispatch = useAppDispatch();

   const { register, handleSubmit, formState: { errors, isValid } } = useForm<IResetPasswordForm>( {
      mode: "onTouched",
      resolver: joiResolver( resetPasswordValidator )
   } );

   const resetPassword = async ( resetPasswordToken: string, password: string ) => {
      const result = await dispatch( authAsyncActions.resetPassword( { resetPasswordToken, password } ) );
      if ( authAsyncActions.resetPassword.fulfilled.match( result ) ) {
         dispatch( appActions.setActionMessage( { message: "Ура! У вас новий пароль!", type: "info" } ) );
         UnauthorizedRouter.navigate( UnauthorizedRoutesEnum.LoginPage );
      }
   };

   const onSubmit: SubmitHandler<IResetPasswordForm> = async ( { repeatPassword, newPassword }: IResetPasswordForm ) => {
      if ( (newPassword && resetPasswordToken) && (newPassword === repeatPassword) ) await resetPassword( resetPasswordToken, newPassword );
      else dispatch( appActions.setActionMessage( { message: "Паролі не співпадають", type: "error" } ) );
   };

   const { BUTTON_COLOR, BUTTON_HOVER_COLOR, MAIN_COLOR, BG_SECOND } = useColorValues();

   return (
       <Center h={ "100vh" } flexDirection={ "column" } gap={ 20 }>
          <Logo color={ MAIN_COLOR }/>

          <VStack bg={ BG_SECOND }
                  p={ "50px" }
                  boxShadow={ "xl" }
                  spacing={ 10 }
                  rounded={ 20 }>

             <form onSubmit={ handleSubmit( onSubmit ) }>

                <VStack alignItems={ "stretch" }
                        spacing={ 0 }
                        w={ 400 }>

                   <AppFormControlPass errorMessage={ errors.newPassword?.message }
                                       register={ register }
                                       isRequired={ true }
                                       labelName={ "Новий пароль" }
                                       fieldName={ "newPassword" }/>

                   <AppFormControlPass errorMessage={ errors.repeatPassword?.message }
                                       register={ register }
                                       labelName={ "Повторіть пароль" }
                                       isRequired={ true }
                                       fieldName={ "repeatPassword" }/>

                   <Button bg={ BUTTON_COLOR }
                           isLoading={ isLoading }
                           type={ "submit" }
                           isDisabled={ !isValid }
                           color={ "white" }
                           size={ "lg" }
                           _hover={ { bg: BUTTON_HOVER_COLOR } }>
                      Відправити
                   </Button>

                </VStack>

             </form>

          </VStack>

       </Center>
   );
}