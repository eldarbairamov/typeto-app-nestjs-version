import React, { Dispatch } from "react";

export type TypedOnChange = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
export type TypedOnChange2 = React.ChangeEvent<HTMLInputElement>
export type TypedSetState<T> = Dispatch<React.SetStateAction<T>>