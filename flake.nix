{
  description = "NixOS configuration";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    home-manager = {
      url = "github:nix-community/home-manager";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    
    chaotic.url = "github:chaotic-cx/nyx/nyxpkgs-unstable";
    chaotic.inputs.nixpkgs.follows = "nixpkgs";
  };

  outputs = inputs @ {
    self,
    nixpkgs,
    home-manager,
    chaotic,
    ...
  }: let
    system = "x86_64-linux";
    username = "demivan";

    pkgs = import nixpkgs {
      inherit system;

      config.allowUnfree = true;
    };
  in {
    nixosConfigurations."ivan-pc" = nixpkgs.lib.nixosSystem {
      modules = [
        ./configuration.nix
        chaotic.nixosModules.default
      ];

      specialArgs = {
        inherit username;
      };
    };

    homeConfigurations.${username} = home-manager.lib.homeManagerConfiguration {
      inherit pkgs;
      extraSpecialArgs = {
        inherit system;
        inherit inputs;
        inherit username;
      };

      modules = [./home-manager/home.nix];
    };

    formatter.${system} = pkgs.alejandra;
  };
}
