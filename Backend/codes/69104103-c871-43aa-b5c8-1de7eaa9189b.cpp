#include <iostream>
#include <string>
using namespace std;

int countVowels(const string& s) {
    int count = 0;
    for (char c : s) {
        // Convert to lowercase and check for vowel
        char lower = tolower(c);
        if (lower == 'a' || lower == 'e' || lower == 'i' || lower == 'o' || lower == 'u') {
            count++;
        }
    }
    return count;
}

int main() {
    string s;
    cin >> s;  // Read input string
    cout << countVowels(s) << endl;
    return 0;
}
