import java.util.ArrayList;
import java.util.InputMismatchException;
import java.util.Scanner;

public class Decipher extends Encipher{
    public Decipher(ArrayList<String> input){
        super(input);
    }

    protected void ceasarianOperation(int shift){
        super.ceasarianOperation(-shift);
    }

    private void AXZY_Operation(int base){
        if (base == 2 || base == 10 || base == 16){
            for (int i = 0; i < input.size(); i++){
                String newLine = "";
                for (String word : input.get(i).split("\t")){
                    String newWord = "";
                    for (String letter : word.split(" ")){
                        try{
                            newWord += String.valueOf(alphabet.charAt(Integer.parseInt(letter, base) - 1));
                        }
                        catch(NumberFormatException ex){
                            newWord += letter;
                        }
                    }
                    newLine += newWord + " ";
                }
                input.set(i, newLine);
            }
        }
        else{
            throw new InputMismatchException();
        }
    }

    public void AXZY(Scanner s){
        boolean innerLoop = true;
        while (innerLoop){
            System.out.println("Prompt base value (2, 10 or 16)");
            System.out.printf("> ");
            try{
                int base = s.nextInt();
                if (base == 2 || base == 10 || base == 16){
                    AXZY_Operation(base);
                    innerLoop = false;
                }
                else{
                    throw new InputMismatchException();
                }
            }
            catch(InputMismatchException ex){
                System.out.println("Please prompt correct integer");
            }
        }
    }
}
