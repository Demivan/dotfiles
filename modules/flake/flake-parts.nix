{ inputs, ... }:
{
  imports = [ inputs.flake-parts.flakeModules.modules ];

  # For lsp support
  debug = true;
}
