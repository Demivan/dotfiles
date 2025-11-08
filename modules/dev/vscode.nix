{
  flake.modules.homeManager.development = { pkgs, ... }: {
    programs.vscode = {
      enable = true;
      package = pkgs.vscode;
    };
  };
}
