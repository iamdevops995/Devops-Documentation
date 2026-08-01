### Comparison operator

***Comparison Operators are helpful to work with conditional Operators.***
 - Comparison Operators always return either True or False.
 - Comparison Operators Expressions 
```
== , != , > , < , >= , <=
```

```yaml
#!/usr/local/bin/ansible-playbook
- name: This will show the Use of Comparision Operators
  hosts: localhost
  gather_facts: false

  vars:
    a : "HELLO"
    d : "hello"
    b : 10
    c : 20

  tasks:
    - name: Operations on variables
      debug: 
        msg:
          - "The value of b is - {{ b }}, and Value of c is - {{ c }}"
          - "Is b greater than c : {{ b > c }}"
          - "Is b less than c : {{ b < c }}"
          - "Is b equals to c : {{ b == c }}"
          - "Is b not equal to c : {{ b != c }}"
          - "Is b greater than or equal to c : {{ b >= c }}"
          - "Is b less than or equal to c : {{ b <= c }}"
          - "Below Comparision is for String"
          - "The value of a is - {{ a }}, and Value of d is - {{ d }}"
          - "Is a greater than d : {{ a > d }}"
          - "Is a less than d : {{ a < d }}"
          - "Is a equals to d : {{ a == d }}"
          - "Is a not equal to d : {{ a != d }}"
          - "Is a equals to d : {{ a|lower == d }}"
```

### Membership Operator

***Membership operator also return True or False.***
 - `in` and `not in` are the membership operators.
***Test Operators are useful to perform the validation in Ansible.***
**Tests for variables** 
- ` is defined`
- `is undefined`
##### **Tests for String** 
- String `is lower`
- String `is Upper`
- String `is String`
##### **Test for numbers**
 - Number `is even`
 - Number `is Odd`
 - Number `is Number`

```yaml
#!/usr/local/bin/ansible-playbook
- name: This will show the Use of Comparision Operators
  hosts: localhost
  gather_facts: false

  vars:
    a : "HELLO"
    d : "hello"
    b : 10
    c : 20
    e : [1,5,9,10,15,109]
    x: "/root/ansible/operators_statement"
    y: "/root/ansible/operators_statement/comparision_operator.yml"

  tasks:
    - name: Operations on variables
      debug: 
        msg:
          - "The List is - {{ e }}, Value of c is - {{ c }} and Value of b is - {{ b }}"
          - "Is b memeber of e : {{ b in e }}"
          - "Is c memeber of e : {{ c in e }}"
          - "Is 25 memeber of e : {{ 25 in e }}"
          - "Is c not a memeber of e : {{ c not in e }}"

    - name: Tests Operators
      debug: 
        msg:
          - "a is defined?   {{ a is defined }}"
          - "c is defined?   {{ c is defined }}"
          - "a is Upper?   {{ a is upper }}"
          - "b is Lower?   {{ b is lower }}"
          - "e is String?   {{ e is string }}"
          - "y is file:   {{ y is file }}"
          - "x is directory: {{ x is directory }}"
          - "y is directory: {{ y is directory }}"
```

### Logical operator

```yaml
#!/usr/local/bin/ansible-playbook
- name: This will show the Use of Comparision Operators
  hosts: localhost
  gather_facts: false

  vars:
    a : "HELLO"
    d : "hello"
    b : 10
    c : 20
    e : [1,5,9,10,15,109]
    x: true
    y: false
    z: false
    m: true

  tasks:
    - name: Operations on variables
      debug: 
        msg:
          - "x and y : {{ x and y }}"
          - "x and m : {{ x and m }}"
          - "x or m : {{ x or m }}"
          - "y or z : {{ y or z}}"
          - "x and y or m: {{ x and y or m}}"
```

### Conditional statement

- **when** is like if condition statement in other languages
- Only execute task if condition is true.
- Condition/expression can be formed with comparison membership, test and logical operator.
```yaml
#!/usr/local/bin/ansible-playbook
- name: This is for Conditional Statement
  hosts: localhost
  gather_facts: false
  vars:
    x : 20
    y : 10
  tasks:
    - name: Operation for Conditional Statement
      debug: 
        msg:
          - "Value of x : {{ x }}, Value of y: {{ y }}"      

    - name: Operation for Conditional Statement I
      debug: 
        msg:
          - "x is Small of y"
      when: x < y

    - name: Operation for Conditional Statement II
      debug: 
        msg:
          - "x is not Small then y"
      when: x > y
```
