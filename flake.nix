{
  description = "NixOS configuration";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    nur.url = "github:nix-community/NUR";

    hyprland = {
      type = "git";
      url = "https://github.com/hyprwm/Hyprland";
      submodules = true;
      inputs.nixpkgs.follows = "nixpkgs";
    };
    ags = {
      url = "github:Aylur/ags/v1";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    nix-colors.url = "github:misterio77/nix-colors";

    nixpkgs-mozilla = {
      url = "github:mozilla/nixpkgs-mozilla";
    };
  };

  outputs = {
    self,
    nixpkgs,
    nur,
    home-manager,
    nixpkgs-mozilla,
    nix-colors,
    ...
  } @ inputs: let
    system = "x86_64-linux";
    username = "demivan";

    pkgs = import nixpkgs {
      inherit system;

      config.allowUnfree = true;

      overlays = [
        # inputs.hyprland.overlays.default
      ];
    };

    ags = pkgs.callPackage ./home-manager/programs/ags { inherit inputs; };

    extraOptions = {lib, ...}: {
      options = {
        font = pkgs.lib.mkOption {
          description = "Font config";
          default = {
            name = "jetbrains-mono";
            family = "JetBrainsMono Nerd Font";
          };
        };
      };
    };
  in {
    nixosConfigurations."ivan-pc" = nixpkgs.lib.nixosSystem {
      inherit system;
      inherit pkgs;

      specialArgs = {
        inherit system;
        inherit inputs;
        inherit username;
        inherit ags;
      };

      modules = [
        nur.modules.nixos.default
        extraOptions
        ./configuration.nix
      ];
    };

    homeConfigurations.${username} = home-manager.lib.homeManagerConfiguration {
      inherit pkgs;

      extraSpecialArgs = {
        inherit system;
        inherit inputs;
        inherit username;
        inherit nix-colors;
        inherit ags;
      };

      modules = [
        # nur.modules.home-manager.default
        extraOptions
        ./home-manager/home.nix
        ({system, ...}: {
          home.packages = [
            ags
          ];
        })
      ];
    };

    formatter.${system} = pkgs.alejandra;
  };
}
