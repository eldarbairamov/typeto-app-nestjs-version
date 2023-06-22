import { Button, Center, Text, VStack } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { emailValidator } from "../../validator";
import { AppFormControl, Logo } from "../../component";
import { useAppDispatch, useAppSelector } from "../../hook";
import { authAsyncActions } from "../../store/slice";
import { UnauthorizedRouter, UnauthorizedRoutesEnum } from "../../router";
import { useColorValues } from "../../constant";

export function ForgotPasswordPage() {
   const { isLoading } = useAppSelector(state => state.authReducer);

   const { register, handleSubmit, formState: { errors, isValid } } = useForm<{ email: string }>({
      resolver: joiResolver(emailValidator),
      mode: "onTouched",
   });

   const dispatch = useAppDispatch();

   const onSubmit: SubmitHandler<{ email: string }> = async ( data: { email: string } ) => {
      await dispatch(authAsyncActions.forgotPassword({ email: data.email }));
      UnauthorizedRouter.navigate(UnauthorizedRoutesEnum.LoginPage);
   };

   const { BUTTON_COLOR, BUTTON_HOVER_COLOR, MAIN_COLOR, FONT_SECOND, BG_SECOND, WHITE_COLOR } = useColorValues();

   return (
       <Center h={ "100vh" } flexDirection={ "column" } gap={ 20 }>

          <Logo color={ MAIN_COLOR }/>

          <VStack bg={ BG_SECOND }
                  p={ "50px" }
                  boxShadow={ "xl" }
                  spacing={ 10 }
                  rounded={ 20 }>

             <Text size={ "md" }
                   fontSize={ 16 }
                   width={ 400 }
                   textAlign={ "center" }
                   color={ FONT_SECOND }>
                Введіть адресу електронної пошти вашого аккаунту і ми пришлемо вам посилання на скидання пароля
             </Text>

             <form onSubmit={ handleSubmit(onSubmit) } noValidate={ true }>

                <VStack alignItems={ "stretch" }
                        spacing={ 0 }
                        w={ 400 }>

                   <AppFormControl errorMessage={ errors.email?.message }
                                   fieldName={ "email" }
                                   textAlign={ "center" }
                                   register={ register }/>

                   <Button bg={ BUTTON_COLOR }
                           isLoading={ isLoading }
                           type={ "submit" }
                           isDisabled={ !isValid }
                           color={ WHITE_COLOR }
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