---
title: 'Note: Password Cracking Using Probabilistic Context-Free Grammars'
date: '2022-09-27'
tags:
   - security
   - password cracking
---

|             |                                                            |
| ----------- | ---------------------------------------------------------- |
| **Source**  | 2009 30th IEEE Symposium on Security and Privacy           |
| **Authors** | Matt Weir, Sudhir Aggarwal, Breno de Medeiros, Bill Glodek |

## Introduction

Approach: use Probabilistic Context-Free Grammars(PCFGs) to model the derivation of password patterns.

## Background and Previous Work

Two most commonly used methods: brute-force and dictionary attacks.

- Brute-force: (often) not feasible due to time and equipment constraints.
- Dictionary attack
  - Crucial: choose word-mangling rules.
  - Question: in what order shoul the word-mangling rules be.
  - Previous work(Narayanan and Shmatikov): Markov Model & Finite State Automaton(FSA) -- do not consider standard dictionary attack.
- Proposed approach: automatically derive word-mangling rules and generate password guesses in probability order.

## Probabilistic Password Cracking

Assumption: not all guesses have the same probability of cracking a password.

Experiment: divide password list into train and test sets.

### Preprocessing

Preprocessing phase: measure the frequencies of certain patterns associated to the password strings.

- $\mathbf{L}$: alpha strings
- $\mathbf{D}$: digit strings
- $\mathbf{S}$: special strings

Base structure: capture the length of the observed strings.

**Only calculate the probabilities for digit and special strings.**

### Using Probabilistic Grammars

Context-Free Grammar can be defined as below:

$$
G = (\mathbf{V}, \mathbf{\Sigma}, \mathbf{S}, \mathbf{P})
$$

- $\mathbf{V}$ is a finite set of non-terminals.
- $\mathbf{\Sigma}$ is a finite set of terminals.
- $\mathbf{S}$ is the start variable.
- $\mathbf{P}$ is a finite set of productions of form:

$$
\boldsymbol{\alpha} \rightarrow \boldsymbol{\beta}
$$

Probabilistic Context-Free Grammar have probabilities associated with each production and add up to 1.

Sentantial form: string derived from the start symbol. Probability of sentential form is the **product** of the probabilities of the productions used in its derivation.

- Pre-terminal probability order: simply fill in all relevant dictionary words for  pre-terminal structures.
- Terminal probability order: based in part on the input dictionary which was not learned during the training phase.

### Efficienty Generating a "Next" Function

Problem: generating guesses in order of non-increasing probabilities.

Proposed mathod: use priority queue(based on max heap[^1]).

Pivot value: next pre-terminal form shall be obtained by replacing variables with an index greater or equal than the popped pivot value. Pivot order is used to ensure the structure in the queue are not duplicated.

Entry in the priority queue contains base structure, pre-terminal form, probability and pivot value.

### Proof of Correctness of the Next Function

- Pivot value ensures no duplication exists and all possible preterminal structures are eventually considered.
- Priority queue ensures pre-terminal structures will be considered in non-increasing order.

## Experiment and Results

Summary: The proposed method in most cases can produce better result than John the Ripper. However, its performance is strongly related to the dictionary used and the similarity between the password complexity in the training and testing sets.

---

[^1]: The parent entries' probability is greater(or maybe equal) compared to its children.
