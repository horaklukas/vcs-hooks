HELP="Script usage ./install-hooks [repository-path]"

REPO_PATH=$1
ERROR=""

if [ -z $REPO_PATH ]; then
  ERROR="Path to repository not provided!"

elif [ ! -d $REPO_PATH ]; then
  ERROR="Directory $REPO_PATH does not exist!"

elif [ ! -d "$REPO_PATH/.git/hooks" ]; then
  ERROR="Directory $REPO_PATH is not git repository!"
fi


if [[ -z $ERROR ]]; then
  cp src/pre-commit $REPO_PATH/.git/hooks/pre-commit
  echo ""
  echo "  Git hooks installed!"
  echo ""
  exit 0
else
  echo ""
  echo "  $ERROR"
  echo "  "
  echo "  $HELP"
  echo ""
  exit 1
fi


#ln -s ../../pre-commit .git/hooks/pre-commit
