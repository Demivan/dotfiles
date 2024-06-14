{ ags, ... }:
{
  home.packages = [ ags ];

  systemd.user.services.ags = {
    Unit = {
      Description = "Ags bar";
    };

    Install = {
      WantedBy = [ "default.target" ];
    };

    Service = {
      ExecStart = "${ags}/bin/ags";
    };
  };
}
