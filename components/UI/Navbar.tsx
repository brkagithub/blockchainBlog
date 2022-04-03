import { useRouter } from "next/router";
import { MouseEvent, useState } from "react";
import { useMoralis } from "react-moralis";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Login, Search } from "@mui/icons-material";
import { Divider, Input, InputAdornment } from "@mui/material";
import { Theme } from "@mui/system";

import ThemeSwitch from "@/components/UI/ThemeSwitch";
import Link from "next/link";

interface IPageSlug {
  page: string;
  slug: string;
}

const PAGES = [
  { page: "Find Talent", slug: "findTalent" },
  { page: "Find Work", slug: "findWork" },
  { page: "About us", slug: "aboutUs" },
];
const PAGES_LOGGED_IN = [
  { page: "All Ads", slug: "allAds" },
  { page: "All Jobs", slug: "allJobs" },
  { page: "Articles for me", slug: "articlesForMe" },
  { page: "Write", slug: "newArticle" },
]; //All ads/jobs should show our ones at the top
const SETTINGS = [
  { page: "Profile", slug: "profile" },
  { page: "My Ads", slug: "myAds" },
  { page: "My Jobs", slug: "myJobs" },
  { page: "My Interests", slug: "myInterests" },
]; //Interests = which tags i want to show up in 'My Articles'

const Navbar = (props: {
  theme: Theme;
  onThemeModeChange: (isDarkMode: boolean) => void;
}) => {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useMoralis();

  const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) =>
    setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) =>
    setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const settings = SETTINGS;
  const pages = isAuthenticated && !!user ? PAGES_LOGGED_IN : PAGES;

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/">
            <Typography
              variant="h5"
              noWrap
              component="div"
              color="secondary"
              sx={{ mr: 2, display: "flex", cursor: "pointer" }}
            >
              DEV3
            </Typography>
          </Link>
          <Input
            sx={{
              color: "secondary",
              "&::before": {
                borderColor: "white !important",
              },
              marginX: 1,
            }}
            placeholder="Search"
            size="small"
            type="search"
            endAdornment={
              <InputAdornment position="end">
                <Search sx={{ color: "white" }} />
              </InputAdornment>
            }
          />

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="secondary" //when we make our own theme this will work correctly (?)
              sx={{ pl: 3 }} //added
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {(pages as Array<IPageSlug>)?.map((pageAndSlug) => (
                <Link key={pageAndSlug.slug} href={`/${pageAndSlug.slug}`}>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign="center" color="secondary">
                      {pageAndSlug.page}
                    </Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "end",
            }}
          >
            {(pages as Array<IPageSlug>)?.map((pageAndSlug) => (
              <Link key={pageAndSlug.slug} href={`/${pageAndSlug.slug}`}>
                <Button
                  onClick={handleCloseNavMenu}
                  color="secondary"
                  sx={{
                    my: 2,
                    display: "block",
                    textTransform: "none",
                  }}
                >
                  {pageAndSlug.page}
                </Button>
              </Link>
            ))}
          </Box>

          {isAuthenticated && !!user ? (
            <Box sx={{ flexGrow: 0, marginX: 1 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={user.getUsername()}
                    src="/static/images/avatar/2.jpg"
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <Link key={setting.slug} href={`/${setting.slug}`}>
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting.page}</Typography>
                    </MenuItem>
                  </Link>
                ))}
                <Divider />
                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    logout().then(() => console.log("Signed out."));
                  }}
                >
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Tooltip title="Login">
              <IconButton
                color="secondary"
                onClick={() => router.push("/login")}
              >
                <Login />
              </IconButton>
            </Tooltip>
          )}
          <ThemeSwitch
            theme={props.theme}
            onModeChange={props.onThemeModeChange}
          />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
