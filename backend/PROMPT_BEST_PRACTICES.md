# Best Practices for Creating Effective OpenAI Prompts

## Context: Movie Recommendations

This document summarizes best practices for creating OpenAI prompts that generate accurate and relevant results in the context of movie recommendations based on viewing history.

## Fundamental Principles

### 1. **Structure and Clarity**

- ✅ Use clearly delimited sections with titles (##)
- ✅ Organize instructions hierarchically
- ✅ Use bullet lists for rules and constraints
- ✅ Separate instructions from user context

### 2. **Rich Context**

- ✅ Provide as much relevant information as possible:
  - Movie title and year
  - User rating
  - Review/feedback if available
  - Genres, directors, actors (if available)
- ✅ Format data in a readable and structured way
- ✅ Number movies to facilitate referencing

### 3. **Specific and Detailed Instructions**

#### Defining the Role

```
You are an expert movie recommendation specialist with deep knowledge of cinema...
```

- Specify the expected expertise
- Clearly define the objective

#### Recommendation Strategy

- Break down the strategy into clear categories (e.g., 70% aligned, 30% discovery)
- Explain the reasoning behind each category
- Provide concrete examples of what is expected

#### Critical Rules

- Use strong words like "NEVER", "MUST", "ALWAYS"
- Explicitly list what must be avoided
- Specify format constraints

### 4. **Strict Output Format**

#### Detailed Specifications

- Define each field with its type and constraint
- Indicate which fields are optional vs required
- Provide a concrete example of the expected format

#### JSON Validation

- Explicitly request "ONLY a valid JSON array"
- Specify "no additional text before or after"
- Include a format example in the instructions

### 5. **Reasoning and Personalization**

#### Preference Analysis

- Ask the model to identify patterns
- Mention the analysis of high ratings
- Encourage referencing specific movies in the reasons

#### Personalized Explanations

- Request detailed reasons (2-3 sentences)
- Encourage referencing movies from the list
- Request an engaging and friendly tone

### 6. **Error Handling**

#### Robust JSON Parsing

```typescript
// Extract JSON even if there's text around it
const jsonMatch = response.match(/\[[\s\S]*\]/);
const jsonString = jsonMatch ? jsonMatch[0] : response;
```

#### Data Validation

- Verify that the number of recommendations matches
- Validate that recommended movies are not already in the list
- Clear error handling with informative messages

## Recommended Prompt Structure

```
1. Role and Expertise
   - Who is the agent
   - What is their level of expertise
   - What is their objective

2. Recommendation Strategy
   - How to analyze preferences
   - How to balance familiarity and discovery
   - How to structure recommendations

3. Critical Rules
   - What must be done
   - What must never be done
   - Specific constraints

4. Output Format
   - Exact expected structure
   - Data types
   - Concrete example

5. Final Instructions
   - Reminder of key points
   - Strict response format
```

## Optimized Prompt Example

See `src/config/llm.conf.ts` for the complete implementation.

### Key Points of the Example:

1. **Structured Instructions**: Clear sections with markdown titles
2. **Detailed Strategy**: 70% aligned, 30% discovery with explanations
3. **Explicit Rules**: "NEVER", "MUST", clear constraints
4. **Format Example**: Concrete JSON with all fields
5. **Final Reminder**: "Respond with ONLY the JSON array"

## Code Improvements Made

### 1. Enriched Movie Formatting

- Inclusion of reviews if available
- Numbering to facilitate referencing
- More readable structure with line breaks

### 2. Robust JSON Parsing

- Automatic JSON extraction even with surrounding text
- Improved error handling with clear messages
- Detailed logging for debugging

### 3. More Detailed Instructions

- Explicit recommendation strategy
- Concrete examples
- Clearly defined constraints

## Additional Tips

### To Further Improve Results

1. **Few-Shot Learning**: Add 2-3 examples of successful recommendations in the prompt
2. **Temperature**: Use a lower temperature (0.3-0.5) for more consistency
3. **Max Tokens**: Limit tokens to force concise responses
4. **System vs User Messages**: Use system instructions for the role, user prompt for context
5. **Post-LLM Validation**: Verify that recommended movies actually exist in TMDB

### Metrics to Monitor

- JSON parsing success rate
- Number of recommendations that actually match in TMDB
- Diversity of recommended genres
- User satisfaction (if measurable)

## References

- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Best Practices for Prompt Engineering](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-openai-api)
