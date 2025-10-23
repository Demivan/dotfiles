{
  lib,
  username,
  ...
}: let
  publicGitEmail = "ivan.demchuk@gmail.com";
  publicKey = "/home/${username}/.ssh/id_yubikey.pub";
in {
  programs.git = {
    enable = true;
    userEmail = publicGitEmail;
    userName = "Ivan Demchuk";
    extraConfig = {
      log.showSignature = true;
      init.defaultBranch = "main";
      pull.rebase = true;
      push = {
        autoSetupRemote = true;
      };

      url = {
        "ssh://git@github.com".insteadOf = "https://github.com";
        "ssh://git@gitlab.com".insteadOf = "https://gitlab.com";
      };

      commit.gpgsign = true;
      gpg.format = "ssh";
      user.signingkey = "${publicKey}";

      gpg.ssh.allowedSignersFile = "/home/${username}/.ssh/allowed_signers";
    };

    signing = {
      signByDefault = true;
      key = publicKey;
    };
  };

  home.file.".ssh/allowed_signers".text = ''
    # TODO: relativeToRoot
    ${publicGitEmail} ${lib.fileContents ../../common/keys/id_kyiv.pub}
    ${publicGitEmail} ${lib.fileContents ../../common/keys/id_kobe.pub}
  '';
}
