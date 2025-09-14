import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.InputMismatchException;
import java.util.Scanner;

public class App {
    public static void main(String[] args) throws Exception {
        Scanner s = new Scanner(System.in);

        ArrayList<String> lines = new ArrayList<>();
        try (BufferedReader in = new BufferedReader(new FileReader("input.md"))){
            while (in.ready()){
                lines.add(in.readLine());
            }

        }
        boolean loop = true;
        Encipher e = null;
        while (loop){
            System.out.println("Prompt 0 for encyphering, 1 for deciphering");
            System.out.printf("> ");
            try{
                int res = s.nextInt();
                if (res == 0){
                    e = new Encipher(lines);
                }
                else{
                    e = new Decipher(lines);
                }
                loop = false;
            }
            catch(InputMismatchException ex){
                System.out.println("Please prompt 0 or 1");
            }
        }

        loop = true;
        while (loop){
            System.out.println("Prompt 0 for ceasarian, 1 for AXZ(X%26) cipher, 2 for combined cipher");
            System.out.printf("> ");
            try{
                int r = s.nextInt();
                switch (r){
                    case 0:
                        e.ceasarian(s);
                        break;
                    case 1:
                        e.AXZY(s);
                        break;
                    case 2:
                        if (e instanceof Decipher){
                            e.AXZY(s);
                            e.ceasarian(s);
                        }
                        else{
                            e.ceasarian(s);
                            e.AXZY(s);
                        }
                        break;
                    default:    
                        System.out.println("Wrong entry");
                }
                loop = false;
            }
            catch (InputMismatchException ex){
                System.out.println("Please prompt 0 or 1");
            }
        }
        s.close();

        try (PrintWriter out = new PrintWriter(new FileWriter("output.md"))){
            for (String str : e.getList()){
                out.write(str + "\n");
            }
        }
    }
}
