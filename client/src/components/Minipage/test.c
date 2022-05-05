int match(int val, int *vptr)
{
  vptr--;
  *vptr = val + 3;
  printf("2:  *vptr = %d\n", *vptr);
  return vptr[2];
}

int set(int val, int *vptr)
{
  val++;
  *vptr += val + 4;
  val = match(val, vptr);
  return *vptr + val;
}

int main()
{
  int val[3] = {40, 10, 50};
  int *vptr = &val[1];
  printf("1: *val = %d\n", *val);
  *val = set(*val, vptr);
  printf("3: *val = %d\n", *val);
  printf("4: *vptr = %d\n", *vptr);
}