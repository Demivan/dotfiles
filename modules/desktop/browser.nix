{ inputs, ... }: {
  flake.modules.homeManager.browser = {
    imports = [
      inputs.zen-browser.homeModules.twilight
    ];

    programs.zen-browser = {
      enable = true;
    };
  };
}
