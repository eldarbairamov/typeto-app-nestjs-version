import { ILoginForm, IRegistrationForm, IResetPasswordForm } from "../interface";
import * as Joi from "joi";
import { emailRegex } from "../constant";

export const registrationValidator = Joi.object<IRegistrationForm>( {

   username: Joi.string().max( 20 ).required().trim().messages( {
      "any.required": "Поле обов'язкове для заповнення",
      "string.empty": "Поле неповинно залишитись пустим",
      "string.max": "Не більше 20-и символів",
      "string.min": "Не менше 2-х символів",
   } ),

   email: Joi.string().pattern( emailRegex ).required().trim().messages( {
      "string.pattern.base": "Недопустимий формат електронної пошти",
      "string.empty": "Поле неповинно залишитись пустим",
      "any.required": "Поле обов'язкове для заповнення",
   } ),

   password: Joi.string().min( 6 ).max( 20 ).required().trim().messages( {
      "string.max": "Не більше 20-и символів",
      "string.min": "Не менше 6-и символів",
      "string.empty": "Поле неповинно залишитись пустим",
      "any.required": "Поле обов'язкове для заповнення",
   } ),

} );

export const resetPasswordValidator = Joi.object<IResetPasswordForm>( {
   newPassword: Joi.string().min( 6 ).max( 20 ).required().trim().messages( {
      "string.max": "Не більше 20-и символів",
      "string.min": "Не менше 6-и символів",
      "string.empty": "Поле неповинно залишитись пустим",
      "any.required": "Поле обов'язкове для заповнення",
   } ),
   repeatPassword: Joi.string().min( 6 ).max( 20 ).required().trim().messages( {
      "string.max": "Не більше 20-и символів",
      "string.min": "Не менше 6-и символів",
      "string.empty": "Поле неповинно залишитись пустим",
      "any.required": "Поле обов'язкове для заповнення",
   } ),
} );

export const loginValidator = Joi.object<ILoginForm>( {

   email: Joi.string().pattern( emailRegex ).required().trim().messages( {
      "string.pattern.base": "Недопустимий формат електронної пошти",
      "string.empty": "Поле неповинно залишитись пустим",
      "any.required": "Поле обов'язкове для заповнення",
   } ),

   password: Joi.string().min( 6 ).max( 20 ).required().trim().messages( {
      "string.max": "Не більше 20-и символів",
      "string.min": "Не менше 6-и символів",
      "string.empty": "Поле неповинно залишитись пустим",
      "any.required": "Поле обов'язкове для заповнення",
   } ),

} );

export const emailValidator = Joi.object<{ email: string }>( {

   email: Joi.string().pattern( emailRegex ).required().trim().messages( {
      "string.pattern.base": "Недопустимий формат електронної пошти",
      "string.empty": "Поле неповинно залишитись пустим",
      "any.required": "Поле обов'язкове для заповнення",
   } ),

} );