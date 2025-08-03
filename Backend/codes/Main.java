import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();

        int vowelCount = 0;
        for (char c : s.toCharArray()) {
            if (isVowel(c)) {
                vowelCount++;
            }
        }

        System.out.println(vowelCount);
    }

    public static boolean isVowel(char c) {
        c = Character.toLowerCase(c);
        return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
    }
}