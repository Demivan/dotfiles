{ ... }:
  let username = "demivan";
in {
  flake.modules.homeManager.demivan = {
    home = {
      username = username;
      homeDirectory = "/home/${username}";
    };

    programs.home-manager.enable = true;
  };
}
