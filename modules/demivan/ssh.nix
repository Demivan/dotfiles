{
  lib,
  ...
}:
let
  pathtokeys = ../../common/keys;
  yubikeys =
    lib.lists.forEach (builtins.attrNames (builtins.readDir pathtokeys))
      # Remove the .pub suffix
      (key: lib.substring 0 (lib.stringLength key - lib.stringLength ".pub") key);
  yubikeyPublicKeyEntries = lib.attrsets.mergeAttrsList (
    lib.lists.map
      # list of dicts
      (key: { ".ssh/${key}.pub".source = "${pathtokeys}/${key}.pub"; })
      yubikeys
  );
in
{
  flake.modules.homeManager.demivan = {
    programs.ssh = {
      enable = true;

      enableDefaultConfig = false;

      matchBlocks = {
        "*" = {
          addKeysToAgent = "yes";
          controlMaster = "auto";
          controlPath = "~/.ssh/sockets/S.%r@%h:%p";
          controlPersist = "10m";
        };
        "git" = {
          host = "gitlab.gnol.com";
          user = "git";
          identityFile = "~/.ssh/id_yubikey";
        };
      };
    };
    home.file = {
      ".ssh/sockets/.keep".text = "# Managed by Home Manager";
    } // yubikeyPublicKeyEntries;
  };
}
