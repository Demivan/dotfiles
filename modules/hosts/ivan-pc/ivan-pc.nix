{ inputs, ... }: {
  # NixOS system configuration
  flake.nixosConfigurations.ivan-pc = inputs.nixpkgs.lib.nixosSystem {
    system = "x86_64-linux";

    modules = with inputs.self.modules.nixos; [
      base
      todo
      desktop
      wayland
      niri
      gaming
      development
    ];
  };

  # Home configuration for demivan on THIS host
  flake.homeConfigurations."demivan@ivan-pc" =
    inputs.home-manager.lib.homeManagerConfiguration {
      pkgs = inputs.self.nixosConfigurations.ivan-pc.pkgs;

      modules = with inputs.self.modules.homeManager; [
        base
        todo
        desktop
        wayland
        niri
        gaming
        development
      ];
    };
}
