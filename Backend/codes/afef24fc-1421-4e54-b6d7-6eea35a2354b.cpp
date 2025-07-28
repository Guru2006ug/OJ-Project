#include <iostream>
#include <string>
#include <algorithm>

using namespace std;

int main() {
    string s;
    getline(cin, s);  // Read input string with spaces

    // Convert to lowercase
    transform(s.begin(), s.end(), s.begin(), ::tolower);

    string vowels = "aeiou";
    int count = 0;

    for (char c : s) {
        if (vowels.find(c) != string::npos) {
            count++;
        }
    }

    cout << count << endl;

    return 0;

