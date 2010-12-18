mkdir ./tmp
mkdir ./tmp/makeTest
cat > ./tmp/makeTest/configure <<EOF
echo "from configure"
echo "hello" >> ./test.txt
EOF
cat > ./tmp/makeTest/Makefile <<EOF
test:
	echo "make test" >> makeTest.txt
EOF

