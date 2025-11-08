{
  flake.modules.homeManager.development = {
    programs.git = {
      enable = true;

      extraConfig = {
        log.showSignature = true;
        init.defaultBranch = "main";
        pull.rebase = true;
        push = {
          autoSetupRemote = true;
        };
      };
    };
  };
}
