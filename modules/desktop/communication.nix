{
  flake.modules.homeManager.communication = { pkgs, ... }: {
    home.packages = with pkgs; [
      slack
      discord
      telegram-desktop
    ];
  };
}
