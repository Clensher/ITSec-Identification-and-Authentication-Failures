import { inject, injectable } from 'inversify';
import { LoggerService } from './logger.service';
import { response } from 'express';


@injectable()
export class PasswordService 
{
  private enforcedLength: number = 10;
  private enforcedSymbols: string[] = ["!", "?", ",", ".", ":", "-"];

  public enforcePasswordPolicies(password: string): boolean 
  {
    var containsSymbol = false;
    var containsNumber = false;
    var containsUpperCase = false;

    if (password.length < this.enforcedLength)
        return false;

    for (let c = 0; c < password.length; c++)
    {
        var currentChar = password.charAt(c);

        if (this.enforcedSymbols.some(s => s === currentChar))
        {
            containsSymbol = true;
        }

        if (!Number.isNaN(currentChar))
        {
            containsNumber = true;
        }

        if (currentChar == currentChar.toUpperCase())
        {
            containsUpperCase = true;
        }
    }

    if (!containsSymbol)
        return false;

    if (!containsNumber)
        return false;

    if (!containsUpperCase)
        return false;

    return true;
  }
}
