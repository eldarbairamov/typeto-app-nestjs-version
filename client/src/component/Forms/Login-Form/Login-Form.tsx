import { Button, HStack, VStack } from "@chakra-ui/react";
import { UnauthorizedRouter, UnauthorizedRoutesEnum } from "../../../router";
import { SubmitHandler, useForm } from "react-hook-form";
import { ILoginForm } from "../../../interface";
import { joiResolver } from "@hookform/resolvers/joi";
import { loginValidator } from "../../../validator";
import { useAppDispatch, useAppSelector } from "../../../hook";
import { authAsyncActions } from "../../../store/slice";
import { AppFormControl, AppFormControlPass } from "../../UI";
import { useColorValues } from "../../../constant";

export function LoginForm() {
   const { isLoading } = useAppSelector(state => state.authReducer);

   const { register, handleSubmit, formState: { errors, isValid } } = useForm<ILoginForm>({
      resolver: joiResolver(loginValidator),
      mode: "onTouched",
   });

   const dispatch = useAppDispatch();

   const onSubmit: SubmitHandler<ILoginForm> = async ( data: ILoginForm ) => dispatch(authAsyncActions.login({ body: data }));

   const { BUTTON_COLOR, BUTTON_HOVER_COLOR, MAIN_COLOR, BG_SECOND, WHITE_COLOR } = useColorValues();

   return (
       <form onSubmit={ handleSubmit(onSubmit) } noValidate={ true }>

          <VStack p={ "50px" }
                  alignItems={ "stretch" }
                  bg={ BG_SECOND }
                  boxShadow={ "xl" }
                  rounded={ 20 }
                  spacing={ 5 }>

             <VStack spacing={ 3 }
                     w={ 300 }>

                <AppFormControl errorMessage={ errors.email?.message }
                                labelName={ "Електронна пошта" }
                                fieldName={ "email" }
                                register={ register }/>

                <AppFormControlPass errorMessage={ errors.password?.message }
                                    register={ register }
                                    labelName={ "Пароль" }
                                    fieldName={ "password" }/>

             </VStack>

             <VStack alignItems={ "stretch" }
                     spacing={ 6 }>

                <Button bg={ BUTTON_COLOR }
                        isLoading={ isLoading }
                        type={ "submit" }
                        isDisabled={ !isValid }
                        color={ WHITE_COLOR }
                        size={ "lg" }
                        _hover={ { bg: BUTTON_HOVER_COLOR } }>
                   Летс гоу
                </Button>

                <HStack justify={ "center" }
                        spacing={ 10 }>

                   <Button variant={ "unstyled" }
                           color={ MAIN_COLOR }
                           onClick={ () => UnauthorizedRouter.navigate(UnauthorizedRoutesEnum.RegistrationPage) }>
                      Немає аккаунту
                   </Button>

                   <Button variant={ "unstyled" }
                           color={ MAIN_COLOR }
                           onClick={ () => UnauthorizedRouter.navigate(UnauthorizedRoutesEnum.ForgotPasswordPage) }>
                      Забув пароль?
                   </Button>

                </HStack>

             </VStack>

          </VStack>

       </form>
   );
}