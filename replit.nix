{ pkgs }: {
  deps = [
    pkgs.python314
    pkgs.nodejs
    pkgs.mysql
  ];
  env = {
    PYTHONUNBUFFERED = "1";
  };
}
