{
  description = "NixOS configuration";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    nur.url = "github:nix-community/NUR";

    lix-module = {
      url = "https://git.lix.systems/lix-project/nixos-module/archive/2.91.0.tar.gz";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    zen-browser = {
      url = "github:MarceColl/zen-browser-flake";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    hyprland = {
      type = "git";
      url = "https://github.com/hyprwm/Hyprland";
      submodules = true;
      inputs.nixpkgs.follows = "nixpkgs";
    };
    ags = {
      url = "github:Aylur/ags";
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
    lix-module,
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
            name = "JetBrainsMono";
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
        lix-module.nixosModules.default
        nur.nixosModules.nur
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
        nur.hmModules.nur
        extraOptions
        # inputs.hyprland.homeManagerModules.default
        ./home-manager/home.nix
        ({system, ...}: {
          home.packages = [
            inputs.zen-browser.packages."${system}".default
            ags
          ];
        })
      ];
    };

    formatter.${system} = pkgs.alejandra;
  };
}
