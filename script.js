async function getRandomTextPassage() {
  const file = await fetch("./stories.json");
  const json = await file.json();
  const stories = json.stories;
  const story = stories[Math.floor(Math.random() * stories.length)];
  console.log(story, "story");

  if (story) {
    document.getElementById("typing-text").innerText = story.text;
  }
}

getRandomTextPassage();
