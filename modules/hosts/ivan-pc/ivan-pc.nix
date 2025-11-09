{ inputs, ... }: {
  # NixOS system configuration
  flake.nixosConfigurations.ivan-pc = inputs.nixpkgs.lib.nixosSystem {
    system = "x86_64-linux";

    modules = with inputs.self.modules.nixos; [
      {
        system.stateVersion = "23.11";

        nix.settings = {
          experimental-features = ["nix-command" "flakes"];
          auto-optimise-store = true;
        };
      }
      base
      todo
      desktop
      niri
      gaming
    ];
  };

  # Home configuration for demivan on THIS host
  flake.homeConfigurations."demivan@ivan-pc" =
    inputs.home-manager.lib.homeManagerConfiguration {
      pkgs = inputs.self.nixosConfigurations.ivan-pc.pkgs;

      modules = with inputs.self.modules.homeManager; [
        {
          home.stateVersion = "23.11";
        }
        todo
        demivan
        browser
        communication
        niri
        # gaming
        development
      ];
    };
}
