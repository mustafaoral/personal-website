---
title: "Better visibility for static readonly field values in Visual Studio"
---

At work, I came across a class that looked like this:

```csharp
public static class ServiceBusQueueNames
{
    /// <summary>Queue name for inbound messages</summary>
    public static readonly string InboundMessage = "inbound-message";

    /// <summary>Queue name for outbound messages</summary>
    public static readonly string OutboundMessage = "outbound-message";
}
```

There was XML documentation, but the descriptions didn't actually provide any more value than the field names themselves at the point of usage.

![Before code change](/assets/images/posts/2022-04-14-const/01-before.png)

Unless I navigated to the the fields, I couldn't see the actual values, which is what I wanted. I changed the documentation to reflect this, since I had concluded that the original descriptions weren't particularly useful to begin with.

```csharp
public static class ServiceBusQueueNames
{
    /// <summary>inbound-message</summary>
    public static readonly string InboundMessage = "inbound-message";

    /// <summary>outbound-message</summary>
    public static readonly string OutboundMessage = "outbound-message";
}
```

This way, I could at least see the values.

![After code change](/assets/images/posts/2022-04-14-const/02-after.png)

Then I found another way. Changing the fields to `const` allowed for the value to be shown and still retained the usual XML documentation.

![Final code change](/assets/images/posts/2022-04-14-const/03-final.png)
