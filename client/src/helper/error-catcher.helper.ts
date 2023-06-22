import { type AxiosApiError } from "../service";

export const errorCatcherFn = ( e: unknown) => {
   const axiosError = e as AxiosApiError;
   const response = axiosError.response?.data.message;

   let message;

   switch (response) {

      case "This email is already in use":
         message = "Користувач з такою електронною поштою вже існує";
         break;

      case "This username is already in use":
         message = "Це імʼя користувача вже зайняте";
         break;

      case "Invalid file type":
         message = "Невірний формат файлу";
         break;

      case "Wrong email or password":
         message = "Невірний пароль або електронна пошта";
         break;

      case "File size must be less than 10 mb":
         message = "Розмір файлу не має перевищувати 3МБ";
         break;

      case "User is not found":
         message = "Користувача з такою електронною поштою не існує";
         break;

      default:
         message = "Непередбачена помилка";
         break;
   }

   return message;
};