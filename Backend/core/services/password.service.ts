import { inject, injectable } from 'inversify';
import { LoggerService } from './logger.service';
import { Connection, r, RConnectionOptions, RDatum } from 'rethinkdb-ts';
import { response } from 'express';


@injectable()
export class PasswordService {
  /* Password security regulations:
   * Minimum length: 10 letters
   * Contains at least 2 numbers
   * Contains at least 1 of the follwing characters: #!?-_
   * Contains at least 2 upper case letters
   * COntains at least 3 lower case letters
  */
  public getPolicyDescription(): string {
    let policyString = "Password requirements: \n" + 
                   "MinimumLength: 10\n" +
                   "Contains at least 2 numbers\n" +
                   "Contains at least 1 of the following characters: [#!?-_] \n" +
                   "Contains at least 2 upper case letters \n" +
                   "Contains at least 3 lower case letters";
    return policyString;
  } 

  public checkPasswordSecurity(password: string): boolean {
    if (password.length < 10){
      return false;
    }

    let countNumbers = 0;
    let countSpecialCharacters = 0;
    let countUpper = 0;
    let countLower = 0;

    for(let i = 0; i < password.length; i++) 
    {
      const character = password.charAt(i);
      if (character.match(/[a-z]/i)){
        if (character == character.toUpperCase()){
          countUpper++;
        }
        else{
          countLower++;
        }
      }
      else if (character.match(/[0-9]/i)){
        countNumbers++;
      }
      else if (character.match(/[#!?-_]/)){
        countSpecialCharacters++;
      }
    }
    if (countLower >= 3 && countUpper >= 2 && countNumbers >= 2 && countSpecialCharacters >= 1){
      return true;
    }
    else {
      return false;
    }
  }
}
