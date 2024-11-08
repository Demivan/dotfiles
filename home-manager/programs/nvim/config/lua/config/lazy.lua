local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  -- bootstrap lazy.nvim
  -- stylua: ignore
  vim.fn.system({ "git", "clone", "--filter=blob:none", "https://github.com/folke/lazy.nvim.git", "--branch=stable", lazypath })
end
vim.opt.rtp:prepend(vim.env.LAZY or lazypath)

require("lazy").setup({
  spec = {
    -- add LazyVim and import its plugins
    { "LazyVim/LazyVim", import = "lazyvim.plugins" },
    -- import any extras modules here
    { import = "lazyvim.plugins.extras.lang.typescript" },
    { import = "lazyvim.plugins.extras.linting.eslint" },
    { import = "lazyvim.plugins.extras.util.project" },
    { import = "lazyvim.plugins.extras.editor.leap" },
    { import = "lazyvim.plugins.extras.lang.omnisharp" },
    { import = "lazyvim.plugins.extras.lang.rust" },
    {
      "williamboman/mason.nvim",
      opts = {
        PATH = "append",
      }
    },
    {
      "nvim-cmp",
        dependencies = {
          "supermaven-inc/supermaven-nvim",
          build = ":SupermavenUseFree", -- remove this line if you are using pro
          opts = {},
        },
        ---@param opts cmp.ConfigSchema
        opts = function(_, opts)
          table.insert(opts.sources, 1, {
            name = "supermaven",
            group_index = 1,
            priority = 100,
          })
        end,
    },
    {
      "stevearc/conform.nvim",
      optional = true, 
      opts = {
        default_format_opts = {
          lsp_format = "fallback",
        },
      },
    },
    {
      "neovim/nvim-lspconfig",
      opts = {
        format = {
          filter = function(client)
            return client.name ~= "volar"
          end,
        },
        servers = {
          omnisharp = {
            cmd = { "/nix/store/zpvg8d9zwwxj6g344cdqv3grpldcxvxz-omnisharp-roslyn-1.39.11/bin/OmniSharp" }
          },
        },
      },
    },
    -- import/override with your plugins
    { import = "plugins" },
  },
  defaults = {
    -- By default, only LazyVim plugins will be lazy-loaded. Your custom plugins will load during startup.
    -- If you know what you're doing, you can set this to `true` to have all your custom plugins lazy-loaded by default.
    lazy = false,
    -- It's recommended to leave version=false for now, since a lot the plugin that support versioning,
    -- have outdated releases, which may break your Neovim install.
    version = false, -- always use the latest git commit
    -- version = "*", -- try installing the latest stable version for plugins that support semver
  },
  checker = { enabled = true }, -- automatically check for plugin updates
  performance = {
    rtp = {
      -- disable some rtp plugins
      disabled_plugins = {
        "gzip",
        -- "matchit",
        -- "matchparen",
        -- "netrwPlugin",
        "tarPlugin",
        "tohtml",
        "tutor",
        "zipPlugin",
      },
    },
  },
})
