import java.util.ArrayList;
import java.util.InputMismatchException;
import java.util.Scanner;

public class Encipher {
    protected String alphabet;
    protected String ALPHABET;
    protected String numbers;
    protected ArrayList<String> input;

    public Encipher(ArrayList<String> input){
        alphabet = "abcdefghijklmnopqrstuvwxyz";
        ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        numbers = "0123456789";
        this.input = input;
    }
 
    protected void ceasarianOperation(int x){
        for (int i = 0; i < input.size(); i++){
            String newS = "";
            for (char c : input.get(i).toCharArray()){
                String stringC = String.valueOf(c);
                if (alphabet.contains(stringC)){
                    int j = alphabet.indexOf(stringC);
                    if (j + x >= 0){
                        newS += alphabet.charAt((j + x)%26);
                    }
                    else{
                        newS += alphabet.charAt(26 + (j + x));
                    }   
                }
                else if (ALPHABET.contains(stringC)){
                    int j = ALPHABET.indexOf(stringC);
                    if (j + x >= 0){
                        newS += ALPHABET.charAt((j + x)%26);
                    }
                    else{
                        newS += ALPHABET.charAt(26 + (j + x));
                    } 
                }
                else if (numbers.contains(stringC)){
                    int j = numbers.indexOf(stringC);
                    if (j + x >= 0){
                        newS += numbers.charAt((j + x)%10);
                    }
                    else{
                        newS += numbers.charAt(10 + (j + x));
                    } 
                }
                else{
                    newS += stringC;
                }
            }

            input.set(i, newS);
        }
    }  
    
    public void ceasarian(Scanner s){
        boolean innerLoop = true;
        while (innerLoop){
            System.out.println("Prompt shift value");
            System.out.printf("> ");
            try{
                ceasarianOperation(s.nextInt());
                innerLoop = false;
            }
            catch(InputMismatchException ex){
                System.out.println("Please prompt integer");
            }
        }
    }

    private void AXZY_Operation(int base){
        for (int i = 0; i < input.size(); i++){
            String newS = "";
            for (char c : input.get(i).toCharArray()){
                String stringC = String.valueOf(c);
                if (alphabet.contains(stringC)){
                    int j = alphabet.indexOf(stringC);
                    newS += Integer.toString(j + 1, base) + " ";
                }
                else if (ALPHABET.contains(stringC)){
                    int j = ALPHABET.indexOf(stringC);
                    newS += Integer.toString(j + 1, base) + " ";
                }
                else if (c == ' '){
                    newS += "\t";
                }
                else{
                    newS += stringC;
                }
            }

            input.set(i, newS);
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

    public ArrayList<String> getList(){
        return input;
    }
}
