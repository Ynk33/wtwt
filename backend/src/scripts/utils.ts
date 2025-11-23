import * as readline from 'readline';
import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

export const inquirer = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const question = (query: string): Promise<string> => {
  return new Promise((resolve) => inquirer.question(query, resolve));
};
