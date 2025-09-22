package org.example.api_sh.exeception;

public class UserAlreadyExistException extends Exception{
    public UserAlreadyExistException() {
        super("User Already Exist");
    }
}
