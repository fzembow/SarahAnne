import argparse
import random
import json


def main():
  parser = argparse.ArgumentParser(description='Generate a weighted trie for a dictionary.')
  parser.add_argument('dictfile', help='Input words, one per line')
  args = parser.parse_args()

  word_iterator = read_words(args.dictfile)

  trie = make_trie(word_iterator)

  print json.dumps(trie, separators=(',',':'))


def read_words(filename):
  try:
    lines = open(filename, "r").readlines()
  except IOError:
    sys.stderr.write("Couldn't read the dictionary file %s" % filename)
    sys.exit(1)
  return lines


def make_trie(word_iterator):

  trie = {}

  for word in word_iterator:

    pointer = trie
    # TODO: Can optimize and store unique suffixes as strings directly.
    
    for char in word:
      if char == "\n":
        pointer[char] = None
      else:
        if char not in pointer:
          pointer[char] = {}
        pointer = pointer[char]
  return trie;


def random_word(trie):

  word = ''

  while trie:
    letters = trie.keys()
    next_letter = random.choice(letters)
    if next_letter == "\n":
      return word

    word += next_letter
    trie = trie[next_letter]


if __name__ == "__main__":
  main()
