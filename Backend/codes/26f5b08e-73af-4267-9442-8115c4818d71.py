s=input().lower()
vow="aeiou"
v=0
for i in s:
    if i in vow:
        v+=1
print(v)