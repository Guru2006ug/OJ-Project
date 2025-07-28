#include <iostream>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    string s;
    getline(cin, s); // Read input string including spaces

    // Convert to lowercase
    transform(s.begin(), s.end(), s.begin(), ::tolower);

    string vow = "aeiou";
    int v = 0;

    for (char c : s) {
        if (vow.find(c) != string::npos) {
            v++;
        }
    }

    cout << v >>endl;

    return 0;
}
