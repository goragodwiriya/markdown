# Mermaid Diagram Examples

This document demonstrates various types of Mermaid diagrams supported by the viewer.

## 1. Flowchart

```mermaid
graph LR
    A[Start] --> B[Load]
    B --> C[Parse]
    C --> D[Render]
    D --> E[Export]
    E --> F[Done]
```

## 2. Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server
    participant Database

    User->>Browser: Open Application
    Browser->>Server: Request Data
    Server->>Database: Query
    Database-->>Server: Return Results
    Server-->>Browser: Send Response
    Browser-->>User: Display Data
```

## 3. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER {
        string name
        string email
        string phone
    }
    ORDER ||--|{ LINE-ITEM : contains
    ORDER {
        int orderNumber
        date orderDate
        string status
    }
    LINE-ITEM {
        int quantity
        decimal price
    }
    PRODUCT ||--o{ LINE-ITEM : "ordered in"
    PRODUCT {
        string name
        string description
        decimal price
    }
```

## 4. Class Diagram

```mermaid
classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    class Cat {
        +String color
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat
```

## 5. State Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : Start
    Processing --> Success : Complete
    Processing --> Error : Fail
    Success --> [*]
    Error --> Retry : Retry
    Retry --> Processing
    Error --> [*] : Give Up
```

## 6. Gantt Chart

```mermaid
gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements    :a1, 2024-01-01, 30d
    Design         :a2, after a1, 20d
    section Development
    Backend        :b1, after a2, 40d
    Frontend       :b2, after a2, 45d
    section Testing
    QA Testing     :c1, after b1, 15d
    UAT            :c2, after c1, 10d
```

## 7. Pie Chart

```mermaid
pie title Programming Languages Usage
    "JavaScript" : 35
    "Python" : 25
    "Java" : 20
    "Go" : 10
    "Others" : 10
```

## 8. Git Graph

```mermaid
gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
    branch feature
    checkout feature
    commit
    checkout main
    merge feature
```

## 9. User Journey

```mermaid
journey
    title User Shopping Experience
    section Browse
      Visit Website: 5: User
      Search Products: 4: User
      View Details: 5: User
    section Purchase
      Add to Cart: 4: User
      Checkout: 3: User
      Payment: 2: User
    section Post-Purchase
      Confirmation: 5: User
      Delivery: 4: User
      Review: 5: User
```

## 10. Mindmap

```mermaid
mindmap
  root((Markdown to PDF))
    Features
      Markdown Parsing
      HTML Rendering
      PDF Generation
      Mermaid Diagrams
    Architecture
      Core Modules
      Plugins
      Utilities
    Deployment
      Browser
      Node.js
      Docker
```

## 11. Timeline

```mermaid
timeline
    title Project Milestones
    2024-Q1 : Planning Phase
             : Requirements Gathering
    2024-Q2 : Development Phase
             : Core Features
             : Testing
    2024-Q3 : Launch Phase
             : Beta Release
             : User Feedback
    2024-Q4 : Growth Phase
             : Feature Expansion
             : Optimization
```

## 12. Quadrant Chart

```mermaid
quadrantChart
    title Technical Debt vs Business Value
    x-axis Low Business Value --> High Business Value
    y-axis Low Technical Debt --> High Technical Debt
    quadrant-1 Quick Wins
    quadrant-2 Strategic Projects
    quadrant-3 Fill-ins
    quadrant-4 Money Pit
    Feature A: [0.2, 0.7]
    Feature B: [0.5, 0.2]
    Feature C: [0.7, 0.8]
    Feature D: [0.8, 0.3]
```

## Conclusion

This document demonstrates the wide variety of Mermaid diagrams that can be rendered in the Markdown viewer. All diagrams are rendered client-side using the Mermaid library.

### Supported Diagram Types

- ✅ Flowcharts
- ✅ Sequence Diagrams
- ✅ Entity Relationship Diagrams (ERD)
- ✅ Class Diagrams
- ✅ State Diagrams
- ✅ Gantt Charts
- ✅ Pie Charts
- ✅ Git Graphs
- ✅ User Journey
- ✅ Mindmaps
- ✅ Timelines
- ✅ Quadrant Charts

### Tips for Best Results

1. **Keep diagrams simple** - Complex diagrams may be hard to read
2. **Use descriptive labels** - Make your diagrams self-explanatory
3. **Choose appropriate themes** - Try different Mermaid themes in settings
4. **Test before exporting** - Preview diagrams before generating PDF

---

*Generated with Markdown to PDF Viewer with Mermaid Support*
